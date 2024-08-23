export function getUniqAvatarName(dirImagesPath: string, imageName: string) {
  return dirImagesPath + Date.now() + imageName;
}
