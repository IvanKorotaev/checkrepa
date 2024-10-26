// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Ваш API-ключ Plant ID
const PLANT_ID_API_KEY = 'DS0YU3TBQuxCbWmY5r7iuk0EaNQYogf0UKuGEPJT1PXjmRD0S6'; // Замените на ваш действительный API-ключ

// Настройка CORS для разрешения запросов с любых доменов
app.use(cors());

// Middleware для парсинга JSON
app.use(express.json({ limit: '10mb' })); // Увеличьте лимит, если необходимо

const PORT = 5000; // Вы можете изменить порт при необходимости

// Маршрут для идентификации растения
app.post('/api/identifyPlant', async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'Изображение не предоставлено' });
    }

    try {
        const requestBody = {
            api_key: PLANT_ID_API_KEY,
            images: [image],
            modifiers: ['similar_images'],
            latitude: 60.100,
            longitude: 30.333,
            plant_language: 'ru',
            language: 'ru',
            plant_details: [
                'common_names',
                'url',
                'name_authority',
                'wiki_description',
                'taxonomy',
                'synonyms',
                'edible_parts',
                'watering',
                'propagation_methods',
                'care_tips',
                'gbif_id',
                'inaturalist_id',
                'best_watering',
                'best_light_condition',
                'best_soil_type',
                'common_uses',
                'toxicity',
                'cultural_significance',
                'rank',
                'image',
                'images',
            ],
        };

        const response = await axios.post('https://api.plant.id/v2/identify', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при обращении к Plant ID API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Ошибка при идентификации растения' });
    }
});

// Обработка ошибок CORS (опционально)
app.use((err, req, res, next) => {
    if (err instanceof Error && err.message === 'Not allowed by CORS') {
        res.status(403).json({ error: 'Не разрешенный CORS origin' });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log('Сервер запущен на порту'+PORT);
});