document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const noteForm = document.getElementById('noteForm');
    const noteIdInput = document.getElementById('noteId');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const contentInput = document.getElementById('content');
    const searchInput = document.getElementById('searchInput');
    const formTitle = document.getElementById('formTitle');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let allNotes = [];

    // Fetch and display notes
    async function fetchNotes() {
        const res = await fetch('/api/notes');
        const result = await res.json();
        if (result.success) {
            allNotes = result.data;
            renderNotes(allNotes);
        }
    }

    function renderNotes(notes) {
        notesContainer.innerHTML = '';
        if (notes.length === 0) {
            notesContainer.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400">
                    No notes found. Create your first one!
                </div>`;
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between';
            
            const badgeColors = {
                Work: 'bg-blue-100 text-blue-800',
                Personal: 'bg-purple-100 text-purple-800',
                DevOps: 'bg-orange-100 text-orange-800',
                General: 'bg-gray-100 text-gray-800'
            };
            const badgeClass = badgeColors[note.category] || badgeColors.General;

            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${badgeClass}">${note.category}</span>
                        <span class="text-xs text-gray-400">${new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">${note.title}</h3>
                    <p class="text-gray-600 text-sm whitespace-pre-line">${note.content}</p>
                </div>
                <div class="flex justify-end space-x-2 mt-6 border-t border-gray-100 pt-3">
                    <button onclick="editNote('${note.id}')" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">Edit</button>
                    <button onclick="deleteNote('${note.id}')" class="text-sm font-medium text-red-600 hover:text-red-800 transition">Delete</button>
                </div>
            `;
            notesContainer.appendChild(card);
        });
    }

    // Form Handling (Create / Update)
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = noteIdInput.value;
        const payload = {
            title: titleInput.value,
            category: categorySelect.value,
            content: contentInput.value
        };

        let res;
        if (id) {
            // Update
            res = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create
            res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const result = await res.json();
        if (result.success) {
            resetForm();
            fetchNotes();
        }
    });

    // Window global assignments so inline HTML buttons can access functions
    window.editNote = (id) => {
        const note = allNotes.find(n => n.id === id);
        if (!note) return;

        noteIdInput.value = note.id;
        titleInput.value = note.title;
        categorySelect.value = note.category;
        contentInput.value = note.content;

        formTitle.textContent = 'Edit Note';
        saveBtn.textContent = 'Update Note';
        cancelBtn.classList.remove('hidden');
    };

    window.deleteNote = async (id) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            fetchNotes();
        }
    };

    function resetForm() {
        noteIdInput.value = '';
        noteForm.reset();
        formTitle.textContent = 'Create New Note';
        saveBtn.textContent = 'Save Note';
        cancelBtn.classList.add('hidden');
    }

    cancelBtn.addEventListener('click', resetForm);

    // Search Engine
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allNotes.filter(note => 
            note.title.toLowerCase().includes(query) || 
            note.content.toLowerCase().includes(query) ||
            note.category.toLowerCase().includes(query)
        );
        renderNotes(filtered);
    });

    // Initial Fetch
    fetchNotes();
});