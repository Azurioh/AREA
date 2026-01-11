/**
 * @type DropboxResource
 * @description The type representing a Dropbox resource.
 *
 * @property {string} tag - The tag of the resource, either 'file' or 'folder'.
 * @property {string} id - The id of the resource.
 */
export type DropboxResource = {
  tag: 'file' | 'folder';
  id: string;
};
