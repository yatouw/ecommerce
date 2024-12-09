<script lang="ts">
    export let isOpen = false;
    export let onClose: () => void;
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center {isOpen ? '' : 'hidden'}">
    <div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4 relative">
        <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Checkout Successful!</h3>
            <p class="mt-2 text-sm text-gray-500">
                Your items have been checked out successfully.
            </p>
            <div class="mt-6">
                <button
                    on:click={onClose}
                    class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</div>