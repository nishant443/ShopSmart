import { useEffect } from 'react';
import api from '../../api/axios';

const APITest = () => {
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connection...');
        console.log('API Base URL:', api.defaults.baseURL);
        
        const response = await api.get('/products');
        console.log('✅ API Response:', response.data);
        
        // Test backend health
        const healthResponse = await fetch('http://localhost:5000');
        const healthData = await healthResponse.json();
        console.log('✅ Backend Health:', healthData);
        
      } catch (error) {
        console.error('❌ API Error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800">API Connection Test</h3>
      <p className="text-yellow-700">Check browser console for API test results</p>
    </div>
  );
};

export default APITest;
