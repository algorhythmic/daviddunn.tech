export interface StreamlitApp {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    appUrl: string;
    category: 'analytics' | 'infographics' | 'dashboard';
    tags: string[];
}

export const streamlitApps: StreamlitApp[] = [
    {
        id: 'pretty-maps',
        title: 'Pretty Maps',
        description: 'Create beautiful map art using OpenStreetMap data. Customize colors, styles, and export high-resolution images.',
        imageUrl: 'https://prettymapp.streamlit.app/~/+/media/f2904a46eab6de9fc13783e3582406cf7024b34f42dcb721c4cfc506.png',
        appUrl: 'https://prettymapp.streamlit.app/',
        category: 'infographics',
        tags: ['maps', 'visualization', 'art']
    },
    {
        id: 'healthcare-dashboard',
        title: 'Healthcare Dashboard',
        description: 'Interactive healthcare analytics dashboard with real-time data visualization.',
        imageUrl: 'https://storage.googleapis.com/s4a-prod-share-preview/default/st_app_screenshot_image/1aced6a9-214c-4120-ad40-61f506dc70f9/Raw_App_Screenshot.png',
        appUrl: 'https://devesh.streamlit.app/',
        category: 'dashboard',
        tags: ['analytics', 'healthcare', 'visualization']
    },
    {
        id: 'gravity-waves-quickview',
        title: 'Gravity Wave Quickview',
        description: 'This app displays data from LIGO, Virgo, and GEO downloaded from the Gravitational Wave Open Science Center at https://gwosc.org',
        imageUrl: 'https://gw-quickview.streamlit.app/~/+/media/6232ba7e5a083abb8c626044921a31d8e9bee2bbd8a3648220abb340.png',
        appUrl: 'https://gw-quickview.streamlit.app/',
        category: 'analytics',
        tags: ['data', 'analysis', 'visualization']
    }
];
