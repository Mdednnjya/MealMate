export const formatImageUrl = (url: string) => {
    if (!url) return '/images/donations/default.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    } else if (url.startsWith('/')) {
        return url;
    } else {
        const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/donations/`;
        return baseUrl + encodeURIComponent(url).replace(/%2F/g, '/');
    }
};