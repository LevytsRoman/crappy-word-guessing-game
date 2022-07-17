export const save = (key, data) => {
  console.log(key);
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
};

export const retrieve = (key) => {
  const jsonData = localStorage.getItem(key);

  if (jsonData) {
    return JSON.parse(jsonData);
  }

  return null;
};

export const remove = (key) => {
  localStorage.removeItem(key);
};
