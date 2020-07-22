import {Platform} from 'react-native';

export const uploadFile = (
  file,
  token,
  {progress, callback, error},
  IMAGE_UPLOAD_URL,
) => {
  const req = new XMLHttpRequest();
  try {
    req.upload.addEventListener('progress', (event) => {
      progress(file.name, Math.round((event.loaded / event.total) * 100));
    });
    req.onreadystatechange = () => {
      callback(file.name, req.response, req.readyState);
    };
    const formData = new FormData();
    formData.append('file', file, file.name);
    req.open('POST', IMAGE_UPLOAD_URL);
    if (token) req.setRequestHeader('x-access-token', token);
    req.send(formData);
  } catch (err) {
    error(err);
  }

  return req;
};

export const getFile = (picker) => {
  return {
    uri:
      Platform.OS === 'ios' && parseInt(Platform.Version.split('.')[0]) < 13
        ? picker.sourceURL
        : picker.path,
    type: picker.mime,
    name: Platform.OS === 'ios' ? picker.filename : picker.modificationDate,
  };
};
