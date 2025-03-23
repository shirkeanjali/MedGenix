import { TranslationServiceClient } from '@google-cloud/translate';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Google Cloud service account key
const keyFilePath = path.join(__dirname, '../config/semiotic-abbey-454605-m6-7ed8cd022084.json');

// Create translation client with the service account key
const translationClient = new TranslationServiceClient({
  keyFilename: keyFilePath,
});

// Get project ID from the key file
const keyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
const projectId = keyFile.project_id;

/**
 * Supported languages map with their codes
 * This will be used by the frontend to display languages in a dropdown
 */
export const SUPPORTED_LANGUAGES = {
  'English': 'en',
  'Hindi': 'hi',
  'Bengali': 'bn',
  'Marathi': 'mr',
  'Telugu': 'te',
  'Tamil': 'ta',
  'Gujarati': 'gu',
  'Kannada': 'kn',
  'Odia': 'or',
  'Malayalam': 'ml',
  'Punjabi': 'pa'
};

/**
 * Translate a text to the target language
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The language code to translate to (e.g., 'hi' for Hindi)
 * @param {string} sourceLanguage - Optional source language code (auto-detect if not provided)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    // Skip translation if target language is English or same as source
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return text;
    }

    // Location where the translation API is located
    const location = 'global';

    // Construct the request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    };

    // Call the translation API
    const [response] = await translationClient.translateText(request);
    
    // Return the translated text from the response
    return response.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
};

/**
 * Batch translate multiple texts to the target language
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLanguage - The language code to translate to
 * @param {string} sourceLanguage - Optional source language code (auto-detect if not provided)
 * @returns {Promise<Array<string>>} - Array of translated texts
 */
export const batchTranslateTexts = async (texts, targetLanguage, sourceLanguage = 'en') => {
  try {
    // Skip translation if target language is English or same as source
    if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
      return texts;
    }

    // Location where the translation API is located
    const location = 'global';

    // Construct the request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: texts,
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    };

    // Call the translation API
    const [response] = await translationClient.translateText(request);
    
    // Extract and return the translated texts
    return response.translations.map(translation => translation.translatedText);
  } catch (error) {
    console.error('Batch translation error:', error);
    // Return original texts if translation fails
    return texts;
  }
};

export default {
  translateText,
  batchTranslateTexts,
  SUPPORTED_LANGUAGES
}; 