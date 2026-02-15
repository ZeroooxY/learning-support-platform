const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("Mongo error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Seed endpoint
// Seed endpoint
const Material = require('./models/Material');
const Counter = require('./models/Counter');

app.post('/api/seed', async (req, res) => {
    try {
        await Material.deleteMany({});
        await Counter.deleteMany({}); // Reset counter

        const materials = [
            {
                title: 'Mathematics: Calculus Basics',
                description: 'Introduction to limits and derivatives.',
                content: 'Calculus is the mathematical study of continuous change...',
                subject: 'Mathematics',
                subMaterials: [
                    { title: 'Limits', description: 'Understanding the concept of limits.', pdfUrl: 'https://www.math.upenn.edu/~deturck/m104/calc101.pdf', content: 'Details about limits.' },
                    { title: 'Derivatives', description: 'Slope of a curve and rate of change.', pdfUrl: 'https://tutorial.math.lamar.edu/pdf/CalculusI/DerivativesIntro.pdf', content: 'Details about derivatives.' }
                ]
            },
            {
                title: 'Physics: Newton\'s Laws',
                description: 'Understanding motion and forces.',
                content: 'Newton\'s laws of motion are three physical laws that, together, laid the foundation for classical mechanics...',
                subject: 'Physics',
                subMaterials: [
                    { title: 'First Law', description: 'Law of Inertia.', pdfUrl: 'https://www.physicsclassroom.com/calcpad/newton/Newtons-Laws.pdf', content: 'Details about First Law.' },
                    { title: 'Second Law', description: 'F = ma.', pdfUrl: 'https://cdn.kastatic.org/ka-perseus-images/19a71569427506945893e15777823737b629471d.pdf', content: 'Details about Second Law.' }
                ]
            },
            {
                title: 'Chemistry: Periodic Table',
                description: 'Explaining groups and periods.',
                content: 'The periodic table, also known as the periodic table of the elements, is a tabular display of the chemical elements...',
                subject: 'Chemistry',
                subMaterials: [
                    { title: 'Alkali Metals', description: 'Group 1 elements.', pdfUrl: 'https://www.rsc.org/periodic-table/alkali-metals.pdf', content: 'Details about Alkali Metals.' }
                ]
            },
            {
                title: 'Biology: Cell Structure',
                description: 'The building blocks of life.',
                content: 'The cell is the basic structural, functional, and biological unit of all known organisms...',
                subject: 'Biology',
                subMaterials: [
                    { title: 'Animal Cells', description: 'Structure of animal cells.', pdfUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK26883/bin/ch12f1.jpg', content: 'Details about Animal Cells.' }
                ]
            },
        ];

        for (const data of materials) {
            // Create Parent
            const parent = await Material.create({
                title: data.title,
                description: data.description,
                content: data.content,
                subject: data.subject,
                type: 'MATERIAL'
            });

            // Create Children
            if (data.subMaterials && data.subMaterials.length > 0) {
                for (const sub of data.subMaterials) {
                    await Material.create({
                        title: sub.title,
                        description: sub.description,
                        content: sub.content || 'Submaterial content placeholder',
                        subject: data.subject, // Inherit subject
                        parent_id: parent.id,
                        type: 'SUBMATERIAL',
                        pdfUrl: sub.pdfUrl
                    });
                }
            }
        }

        res.json({ message: 'Database seeded with hierarchical materials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Trigger restart

