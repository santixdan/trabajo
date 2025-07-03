export function formatDate(TheDate) {
    const date = new Date(TheDate);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);

    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // usa formato de 24 horas, si prefieres 12 horas, cámbialo a true
    };

    return date.toLocaleString("es-ES", options);
}