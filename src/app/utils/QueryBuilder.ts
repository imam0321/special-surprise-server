import { Prisma } from "@prisma/client";

type TQueryOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
  searchTerm?: string;
  searchFields?: string[];
};

type TIncludeOptions = Record<string, boolean | object>;

export class QueryBuilder<T = any> {
  constructor(
    private model: any,
    private options: TQueryOptions,
    private filters: Record<string, any> = {},
    private includeOptions: TIncludeOptions = {}
  ) { }

  private customWhere: any[] = [];

  /*  Set Include  */
  setInclude(includes: TIncludeOptions) {
    Object.assign(this.includeOptions, includes);
    return this;
  }

  /*  Add Custom Where  */
  addWhere(condition: object) {
    if (condition) this.customWhere.push(condition);
    return this;
  }

  /*  Add Range Filter  */
  addRangeFilter(field: string, min?: number, max?: number) {
    if (min != null || max != null) {
      this.customWhere.push({
        [field]: { ...(min != null && { gte: min }), ...(max != null && { lte: max }) },
      });
    }
    return this;
  }

  /*  Add In Filter  */
  addInFilter(field: string, values?: any[]) {
    if (values?.length) {
      this.customWhere.push({ [field]: { in: values } });
    }
    return this;
  }

  /*  Add Role Filter  */
  addRoleBasedFilter(role: string, userId?: string) {
    if (role === "USER" && userId) {
      this.customWhere.push({ userId });
    }
    return this;
  }

  /*  Type Conversion  */
  private convertValue(value: any) {
    if (value === undefined || value === null || value === "") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }

  /*  Pagination  */
  private buildPagination() {
    const page = Number(this.options.page) || 1;
    const limit = Number(this.options.limit) || 10;
    return { page, limit, skip: (page - 1) * limit };
  }

  /*  WHERE builder  */
  private buildWhere(): any {
    const { searchTerm, searchFields = [] } = this.options;

    const andConditions: any[] = [];

    // Search
    if (searchTerm && searchFields.length > 0) {
      andConditions.push({
        OR: searchFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        })),
      });
    }

    // Filters
    for (const [key, value] of Object.entries(this.filters)) {
      const converted = this.convertValue(value);
      if (converted !== null) {
        andConditions.push({ [key]: converted });
      }
    }

    // Custom Where
    andConditions.push(...this.customWhere);

    return andConditions.length ? { AND: andConditions } : {};
  }

  /*  Sort  */
  private buildOrderBy() {
    return {
      [this.options.sortBy || "createdAt"]: (this.options.sortOrder || "desc") as "asc" | "desc",
    };
  }

  /*  Exec with Pagination  */
  async exec() {
    const { limit, skip, page } = this.buildPagination();
    const where = this.buildWhere();
    const orderBy = this.buildOrderBy();

    const [data, total] = await Promise.all([
      this.model.findMany({ where, skip, take: limit, orderBy, include: this.includeOptions }),
      this.model.count({ where }),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }

  /*  Exec All  */
  async execAll() {
    return {
      data: await this.model.findMany({
        where: this.buildWhere(),
        orderBy: this.buildOrderBy(),
        include: this.includeOptions,
      }),
    };
  }

  /*  Count  */
  async count() {
    return this.model.count({ where: this.buildWhere() });
  }
}
