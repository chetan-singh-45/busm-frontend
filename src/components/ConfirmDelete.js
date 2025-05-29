import toast from 'react-hot-toast';

export function ConfirmDelete(onConfirm) {
  toast((t) => (
    <div className="flex flex-col space-y-2">
      <h2>Remove</h2>
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
            toast.success("deleted successfully")
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
         Delete it
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
  });
}
