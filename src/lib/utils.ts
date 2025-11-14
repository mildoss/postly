export const getUniqueFileName = (file: File) => {
  const extension = file.name.split('.').pop();
  return `${Math.random().toString(36).substring(2)}_${Date.now()}.${extension}`;
}