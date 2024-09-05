export function getUniqAvatarName(dirImagesPath: string, imageName: string) {
  return dirImagesPath + Date.now() + imageName;
}

export function isUniqueEmailError(error: any) {
  return error.code === '23505' && /email/.test(error.detail);
}
