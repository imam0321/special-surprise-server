export const getPublicIdFromUrl = (url: string) => {
  const parts = url.split("/");
  const fileName = parts.pop();
  const folder = parts.pop(); 

  return `${folder}/${fileName?.split(".")[0]}`;
};
