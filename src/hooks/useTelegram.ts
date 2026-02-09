import { useEffect, useState } from 'react';

declare global {
    interface Window {
        Telegram: {
            WebApp: any;
        };
    }
}

export function useTelegram() {
    const [tg, setTg] = useState<any>(null);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setTg(window.Telegram.WebApp);
        }
    }, []);

    const onClose = () => {
        tg?.close();
    };

    const onExpand = () => {
        tg?.expand();
    };

    const onReady = () => {
        tg?.ready();
    }

    return {
        onClose,
        onExpand,
        onReady,
        tg,
        user: tg?.initDataUnsafe?.user,
        queryId: tg?.initDataUnsafe?.query_id,
    };
}
