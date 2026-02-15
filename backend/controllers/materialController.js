const Material = require('../models/Material');
const User = require('../models/User');

// @desc    Create a new material or sub-material
// @route   POST /api/materials
// @access  Private
const createMaterial = async (req, res) => {
    const { title, description, content, subject, parent_id, pdfUrl } = req.body;

    if (!title || !description || !content || !subject) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        let type = 'MATERIAL';
        if (parent_id) {
            type = 'SUBMATERIAL';
            // Verify parent exists
            const parent = await Material.findOne({ id: parent_id, isDeleted: false });
            if (!parent) {
                return res.status(404).json({ message: 'Parent material not found' });
            }
        }

        const material = await Material.create({
            title,
            description,
            content,
            subject,
            parent_id: parent_id || null,
            type,
            pdfUrl: pdfUrl || null,
        });

        const response = material.toObject();
        delete response._id;
        delete response.__v;

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Soft delete a material and its children
// @route   DELETE /api/materials/:id
// @access  Private
const deleteMaterial = async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format. ID must be a number.' });
        }

        const material = await Material.findOne({ id: id });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        material.isDeleted = true;
        await material.save();

        // Also delete children
        await Material.updateMany({ parent_id: id }, { isDeleted: true });

        res.json({ message: 'Material and sub-materials removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all materials (Root only)
// @route   GET /api/materials?search=keyword
// @access  Private
const getMaterials = async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                title: {
                    $regex: req.query.search,
                    $options: 'i', // case-insensitive
                },
            }
            : {};

        // Only fetch root materials (parent_id: null)
        const materials = await Material.find({ ...keyword, isDeleted: false, parent_id: null })
            .select('-_id -__v');

        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get material by ID with its sub-materials
// @route   GET /api/materials/:id
// @access  Private
const getMaterialById = async (req, res) => {
    try {
        const id = req.params.id;

        // Validation: id must be a number
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format. ID must be a number.' });
        }

        const material = await Material.findOne({ id: id, isDeleted: false }).select('-_id -__v');

        if (material) {
            // Fetch sub-materials
            const subMaterials = await Material.find({ parent_id: id, isDeleted: false }).select('-_id -__v');

            const response = material.toObject();
            response.subMaterials = subMaterials;

            res.json(response);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sub-material by ID directly (since it has its own ID now)
// @route   GET /api/materials/sub/:id (Adjust route if needed, or just use getMaterialById)
// But to keep compatibility with old route structure: /api/materials/:id/sub/:subId ?
// Actually, with the new structure, submaterials are just materials.
// However, the user might still want the old route style or specific logic.
// Let's implement a generic get which works for any material ID.
// But if specifically asked for parent context, we can derive it.
const getSubMaterial = async (req, res) => {
    // The old route was GET /api/materials/:id/sub/:subId
    // With unique IDs, we can just find by subId.
    // validating parentId match is good practice but strict.
    try {
        const { id, subId } = req.params; // id is parent, subId is child

        const subMaterial = await Material.findOne({ id: subId, isDeleted: false, parent_id: id }).select('-_id -__v');

        if (!subMaterial) {
            return res.status(404).json({ message: 'Sub-material not found or does not belong to this parent' });
        }

        const parent = await Material.findOne({ id: id }).select('title');

        const response = subMaterial.toObject();
        if (parent) {
            response.parentTitle = parent.title;
        }

        res.json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a material
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterial = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, content, subject, pdfUrl, parent_id } = req.body;

        const material = await Material.findOne({ id: id });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        material.title = title || material.title;
        material.description = description || material.description;
        material.content = content || material.content;
        material.subject = subject || material.subject;
        material.pdfUrl = pdfUrl || material.pdfUrl;

        // Handle parent_id change if needed (might need validation)
        if (parent_id !== undefined) {
            material.parent_id = parent_id;
            material.type = parent_id ? 'SUBMATERIAL' : 'MATERIAL';
        }

        const updatedMaterial = await material.save();
        res.json(updatedMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle save material for user
// @route   POST /api/materials/save/:id
// @access  Private
const toggleSaveMaterial = async (req, res) => {
    try {
        const materialId = req.params.id;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the actual Mongo _id of the material based on our custom 'id'
        const material = await Material.findOne({ id: materialId });
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check if already saved
        const index = user.savedMaterials.indexOf(material._id);

        let shouldSave = false;

        if (index === -1) {
            // Not saved, add it
            user.savedMaterials.push(material._id);
            shouldSave = true;
        } else {
            // Already saved, remove it
            user.savedMaterials.splice(index, 1);
            shouldSave = false;
        }

        await user.save();

        res.json({
            message: shouldSave ? 'Material saved' : 'Material unsaved',
            isSaved: shouldSave
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's saved materials
// @route   GET /api/materials/saved
// @access  Private
const getSavedMaterials = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedMaterials',
            select: '-_id -__v'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.savedMaterials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all deleted materials (admin only)
// @route   GET /api/materials/deleted
// @access  Private/Admin
const getDeletedMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ isDeleted: true })
            .populate('parent_id', 'title id')
            .select('-_id -__v');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Restore deleted material
// @route   PUT /api/materials/:id/restore
// @access  Private/Admin
const restoreMaterial = async (req, res) => {
    try {
        const id = req.params.id;
        const material = await Material.findOne({ id: id });

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check if this is a submaterial and if parent is also deleted
        if (material.parent_id) {
            const parent = await Material.findOne({ id: material.parent_id });
            if (parent && parent.isDeleted) {
                return res.status(400).json({
                    message: `Please restore the parent material "${parent.title}" first`
                });
            }
        }

        material.isDeleted = false;
        material.deletedAt = null;
        await material.save();

        // Also restore child submaterials if this is a parent
        if (!material.parent_id) {
            await Material.updateMany(
                { parent_id: id },
                { isDeleted: false, deletedAt: null }
            );
        }

        res.json({ message: 'Material restored successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMaterials,
    getMaterialById,
    createMaterial,
    deleteMaterial,
    getSubMaterial,
    updateMaterial,
    toggleSaveMaterial,
    getSavedMaterials,
    getDeletedMaterials,
    restoreMaterial
};
