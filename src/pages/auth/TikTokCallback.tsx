import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocialMediaService } from '../../services/socialMediaService';

const TikTokCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      SocialMediaService.connectTikTok(code)
        .then(() => navigate('/dashboard'))
        .catch(() => alert('TikTok bağlantısı başarısız!'));
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-64">
      <span className="text-lg font-semibold">TikTok hesabınız bağlanıyor...</span>
    </div>
  );
};

export default TikTokCallback; 