export function isRestaurantOpen(openTime, closeTime) {
    const now = new Date();

    const [oh, om] = openTime.split(":").map(Number);
    const [ch, cm] = closeTime.split(":").map(Number);

    const open = new Date();
    open.setHours(oh, om, 0);

    const close = new Date();
    close.setHours(ch, cm, 0);

    // Overnight support (e.g. 18:00 → 02:00)
    if (close <= open) {
        close.setDate(close.getDate() + 1);
    }

    return now >= open && now <= close;
}
