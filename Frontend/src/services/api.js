const API_BASE_URL = 'http://localhost:8000';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const token = getAuthToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    const errorMessage = errorData.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  
  // Handle cases with no response body (like DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return response.json();
};

export const login = (email, password) => {
  return apiRequest('/user/login', 'POST', { email, password });
};

export const signup = (firstname, lastname, email, password) => {
  const payload = { firstname, email, password };
  if (lastname) {
    payload.lastname = lastname;
  }
  return apiRequest('/user/signup', 'POST', payload);
};

export const shortenUrl = (url) => {
  return apiRequest('/shorten', 'POST', { url });
};

export const getUrls = () => {
  return apiRequest('/codes', 'GET');
};

export const deleteUrl = (id) => {
  return apiRequest(`/${id}`, 'DELETE');
};
