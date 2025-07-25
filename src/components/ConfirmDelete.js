import toast from 'react-hot-toast';

export function ConfirmDelete(onConfirm) {
  toast((t) => (
    <div className="flex flex-col space-y-2 w-64">
      <h2 className="text-sm font-medium">Are you sure to remove?</h2>

      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={async () => {
            const loadingId = toast.loading('Removing...');

            try {
              await onConfirm(); // ensure this returns a Promise
              toast.dismiss(loadingId);
              toast.dismiss(t.id);
              toast.success("Deleted successfully");
            } catch (err) {
              toast.dismiss(loadingId);
              toast.dismiss(t.id);
              toast.error("Failed to delete");
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Remove
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
    duration: 10000, // stays long enough for async actions
  });
}
