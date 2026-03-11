import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export function TelegramBackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const { showBackButton, hideBackButton, onBackClick, offBackClick, tg } = useTelegram();

    useEffect(() => {
        if (!tg) return;

        // Show back button on all pages except the home page
        if (location.pathname !== '/') {
            showBackButton();
        } else {
            hideBackButton();
        }

        const handleBackClick = () => {
            navigate(-1);
        };

        onBackClick(handleBackClick);

        return () => {
            offBackClick(handleBackClick);
        };
    }, [location.pathname, navigate, showBackButton, hideBackButton, onBackClick, offBackClick, tg]);

    return null;
}
