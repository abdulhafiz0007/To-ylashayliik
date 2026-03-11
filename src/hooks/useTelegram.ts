import { useEffect, useState } from 'react';

declare global {
    interface Window {
        Telegram: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            WebApp: any;
        };
    }
}

export function useTelegram() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tg, setTg] = useState<any>(() => {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            return window.Telegram.WebApp;
        }
        return null;
    });

    useEffect(() => {
        if (!tg && typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTg(window.Telegram.WebApp);
        }
    }, [tg]);

    const onClose = () => {
        tg?.close();
    };

    const onExpand = () => {
        tg?.expand();
    };

    const onReady = () => {
        tg?.ready();
    }

    const switchInlineQuery = (query: string, chooseTypes: string[] = ['users', 'groups', 'channels']) => {
        tg?.switchInlineQuery(query, chooseTypes);
    }

    const showBackButton = () => {
        tg?.BackButton?.show();
    };

    const hideBackButton = () => {
        tg?.BackButton?.hide();
    };

    const onBackClick = (callback: () => void) => {
        tg?.BackButton?.onClick(callback);
    };

    const offBackClick = (callback: () => void) => {
        tg?.BackButton?.offClick(callback);
    };

    return {
        onClose,
        onExpand,
        onReady,
        showBackButton,
        hideBackButton,
        onBackClick,
        offBackClick,
        switchInlineQuery,
        tg,
        isTelegram: !!window.Telegram?.WebApp?.initData,
        initData: window.Telegram?.WebApp?.initData || "",
        user: tg?.initDataUnsafe?.user,
        queryId: tg?.initDataUnsafe?.query_id,
    };
}
