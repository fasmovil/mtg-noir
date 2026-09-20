export async function searchCard(name) {
  const url = new URL('/api/cards/search', window.location.origin);
  url.searchParams.set('name', name);

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Inténtalo de nuevo.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');

  if (!isJson) {
    if (response.status === 404) {
      throw new Error('El servicio de búsqueda no está disponible. Verifica que el backend de MTG Noir esté activo en el puerto 3001.');
    }

    throw new Error('El servidor devolvió una respuesta inesperada.');
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('El servidor devolvió una respuesta inesperada.');
  }

  if (!response.ok) {
    throw new Error(payload.error?.message || 'No se pudo completar la búsqueda.');
  }

  return payload;
}
