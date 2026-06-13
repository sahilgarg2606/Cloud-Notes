// In-memory array acting as our database
let notes = [
    {
        id: '1',
        title: 'Welcome Note 🚀',
        content: 'This app is database-free and ready for your Docker and CI/CD practices!',
        category: 'Work',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'DevOps Checklist',
        content: '1. Dockerize App\n2. Create GitHub Actions Workflow\n3. Deploy to Cloud',
        category: 'Personal',
        createdAt: new Date().toISOString()
    }
];

exports.getAllNotes = (req, res) => {
    try {
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notes.' });
    }
};

exports.createNote = (req, res) => {
    try {
        const { title, content, category } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required.' });
        }

        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            category: category || 'General',
            createdAt: new Date().toISOString()
        };

        notes.unshift(newNote); // Add to the top
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create note.' });
    }
};

exports.updateNote = (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            return res.status(404).json({ success: false, message: 'Note not found.' });
        }

        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title || notes[noteIndex].title,
            content: content || notes[noteIndex].content,
            category: category || notes[noteIndex].category,
            updatedAt: new Date().toISOString()
        };

        res.status(200).json({ success: true, data: notes[noteIndex] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update note.' });
    }
};

exports.deleteNote = (req, res) => {
    try {
        const { id } = req.params;
        const noteIndex = notes.findIndex(note => note.id === id);

        if (noteIndex === -1) {
            return res.status(404).json({ success: false, message: 'Note not found.' });
        }

        notes.splice(noteIndex, 1);
        res.status(200).json({ success: true, message: 'Note deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete note.' });
    }
};