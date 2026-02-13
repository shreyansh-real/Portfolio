// API Configuration for environment-based URLs
export const getApiUrl = (): string => {
  // During build time, Vite processes VITE_* variables
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  console.log('Environment:', import.meta.env.MODE);
  console.log('API URL from env:', apiUrl);
  console.log('API URL final:', apiUrl || 'http://localhost:5000');
  
  return apiUrl || 'http://localhost:5000';
};
