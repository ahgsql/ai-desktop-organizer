function alternate(arr, fn) {
    let index = 0;

    return function (...args) {
        // Fonksiyonu çağırmadan önce, diziden doğru elemanı al
        const currentItem = arr[index];

        // Sıradaki indeksi ayarla
        index = (index + 1) % arr.length;

        // Fonksiyonu verilen argümanlar ve şu anki item ile çağır
        return fn(currentItem, ...args);
    };
} const apiKeys = ['key1', 'key2', 'key4', '114'];

// Kullanılacak fonksiyon
function makeApiCall(apiKey, url) {
    console.log(`Making API call to ${url} with API key: ${apiKey}`);
    // Burada gerçek bir API çağrısı yapılabilir
}

// alternate fonksiyonunu kullanarak yeni bir fonksiyon oluştur
const alternateApiCall = alternate(apiKeys, makeApiCall);

// Şimdi bu fonksiyonu ardışık olarak çağırdığımızda, sırasıyla apiKeys içindeki anahtarları kullanacak
alternateApiCall('https://api.example.com/data1'); // key1 ile çağrı yapar
alternateApiCall('https://api.example.com/data2'); // key2 ile çağrı yapar
alternateApiCall('https://api.example.com/data3'); // tekrar key1 ile çağrı yapar
alternateApiCall('https://api.example.com/data4'); // tekrar key2 ile çağrı yapar