import AsyncStorage from '@react-native-async-storage/async-storage';

const JSON_HEADERS = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

class HttpService {
  static async get(url) {
    const header = await JSON_HEADERS();
    const response = await fetch(url, { method: 'GET', headers: header });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong!');
    }
    return result;
  }

  static async post(url, data) {
    const header = await JSON_HEADERS();
    const response = await fetch(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong!');
    }
    return result;
  }

  static async put(url, data) {
    const header = await JSON_HEADERS();
    const response = await fetch(url, {
      method: 'PUT',
      headers: header,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong!');
    }
    return result;
  }

  static async delete(url) {
    const header = await JSON_HEADERS();
    const response = await fetch(url, { method: 'DELETE', headers: header });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong!');
    }
    return result;
  }

  static async postMultipart(url, formData) {
    const token = await AsyncStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong!');
    }
    return result;
  }


static async putMultipart(url, formData) {
  const token = await AsyncStorage.getItem('authToken');

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      // 🚨 Don't set Content-Type here! 
      // fetch will automatically set the correct multipart boundary.
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong!');
  }
  return result;
}
}

export default HttpService;
