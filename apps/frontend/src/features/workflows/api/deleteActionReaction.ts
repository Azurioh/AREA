export async function deleteActionReaction(id: string): Promise<void> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}actions-reactions/v1/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Delete failed:', response.status, errorData);
    throw new Error(`Failed to delete action reaction: ${response.status} - ${errorData}`);
  }
}
