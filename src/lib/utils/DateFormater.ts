export  function DateFormater(dateValue: string | Date) {
    const date = new Date(dateValue);
    const now = new Date();
  
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
  
    if (isToday) {
      return date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (isYesterday) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  }

  
  