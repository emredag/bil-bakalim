//! Database seeding module
//!
//! Handles initial data population on first launch:
//! - Default category "Genel Kelimeler" (70 words)
//! - Default application settings

use rusqlite::{Connection, Result};

/// Represents a word with its metadata
struct Word {
    word: &'static str,
    letter_count: i32,
    hint: &'static str,
}

/// All 70 default words for "Genel Kelimeler" category
/// Organized by letter count (4-10 letters, 10 words each)
const DEFAULT_WORDS: &[Word] = &[
    // 4-letter words (10 words)
    Word {
        word: "BOOK",
        letter_count: 4,
        hint: "Kitap - okumak için kullanılan basılı eser",
    },
    Word {
        word: "GAME",
        letter_count: 4,
        hint: "Oyun - eğlence amaçlı oynanan aktivite",
    },
    Word {
        word: "TIME",
        letter_count: 4,
        hint: "Zaman - olayların sırası ve süresi",
    },
    Word {
        word: "LOVE",
        letter_count: 4,
        hint: "Sevgi, aşk - güçlü duygusal bağ",
    },
    Word {
        word: "MEAL",
        letter_count: 4,
        hint: "Öğün - sabah, öğle veya akşam yemeği",
    },
    Word {
        word: "ROAD",
        letter_count: 4,
        hint: "Yol - araçların ve insanların geçtiği güzergah",
    },
    Word {
        word: "COLD",
        letter_count: 4,
        hint: "Soğuk - düşük sıcaklık",
    },
    Word {
        word: "WORD",
        letter_count: 4,
        hint: "Kelime - anlamlı harf grubu",
    },
    Word {
        word: "ROOM",
        letter_count: 4,
        hint: "Oda - binanın bir bölümü",
    },
    Word {
        word: "RAIN",
        letter_count: 4,
        hint: "Yağmur - gökten düşen su damlacıkları",
    },
    // 5-letter words (10 words)
    Word {
        word: "DANCE",
        letter_count: 5,
        hint: "Dans etmek - müzik eşliğinde yapılan hareketler",
    },
    Word {
        word: "WATCH",
        letter_count: 5,
        hint: "İzlemek / saat - görmek veya zaman ölçen cihaz",
    },
    Word {
        word: "STUDY",
        letter_count: 5,
        hint: "Ders çalışmak - öğrenmek için araştırma yapmak",
    },
    Word {
        word: "BREAD",
        letter_count: 5,
        hint: "Ekmek - un, su ve mayadan yapılan besin",
    },
    Word {
        word: "MUSIC",
        letter_count: 5,
        hint: "Müzik - seslerden oluşan sanat dalı",
    },
    Word {
        word: "DREAM",
        letter_count: 5,
        hint: "Hayal / rüya - uykuda görülen olaylar",
    },
    Word {
        word: "APPLE",
        letter_count: 5,
        hint: "Elma - meyvesi yenen ağaç",
    },
    Word {
        word: "CHAIR",
        letter_count: 5,
        hint: "Sandalye - oturmak için kullanılan mobilya",
    },
    Word {
        word: "SPORT",
        letter_count: 5,
        hint: "Spor - fiziksel aktivite ve yarışma",
    },
    Word {
        word: "WATER",
        letter_count: 5,
        hint: "Su - canlılar için hayati sıvı",
    },
    // 6-letter words (10 words)
    Word {
        word: "SCHOOL",
        letter_count: 6,
        hint: "Okul - öğrencilerin eğitim gördüğü kurum",
    },
    Word {
        word: "TRAVEL",
        letter_count: 6,
        hint: "Seyahat etmek - bir yerden başka bir yere gitmek",
    },
    Word {
        word: "NATURE",
        letter_count: 6,
        hint: "Doğa - canlılar ve çevrenin bütünü",
    },
    Word {
        word: "ANIMAL",
        letter_count: 6,
        hint: "Hayvan - insanlar dışındaki canlılar",
    },
    Word {
        word: "MOTHER",
        letter_count: 6,
        hint: "Anne - çocuğu doğuran kadın",
    },
    Word {
        word: "FATHER",
        letter_count: 6,
        hint: "Baba - çocuğun erkek ebeveyni",
    },
    Word {
        word: "FRIEND",
        letter_count: 6,
        hint: "Arkadaş - yakın dost, ahbap",
    },
    Word {
        word: "FAMILY",
        letter_count: 6,
        hint: "Aile - anne, baba ve çocukların oluşturduğu topluluk",
    },
    Word {
        word: "SUMMER",
        letter_count: 6,
        hint: "Yaz mevsimi - yılın en sıcak dönemi",
    },
    Word {
        word: "WINTER",
        letter_count: 6,
        hint: "Kış mevsimi - yılın en soğuk dönemi",
    },
    // 7-letter words (10 words)
    Word {
        word: "SUBJECT",
        letter_count: 7,
        hint: "Ders - okul müfredatında yer alan konu",
    },
    Word {
        word: "CULTURE",
        letter_count: 7,
        hint: "Kültür - toplumun yaşam biçimi ve değerleri",
    },
    Word {
        word: "TEACHER",
        letter_count: 7,
        hint: "Öğretmen - eğitim veren kişi",
    },
    Word {
        word: "STUDENT",
        letter_count: 7,
        hint: "Öğrenci - eğitim alan kişi",
    },
    Word {
        word: "COUNTRY",
        letter_count: 7,
        hint: "Ülke - sınırları belli olan coğrafi bölge",
    },
    Word {
        word: "HOLIDAY",
        letter_count: 7,
        hint: "Tatil - dinlenme ve eğlence dönemi",
    },
    Word {
        word: "PICTURE",
        letter_count: 7,
        hint: "Resim - görsel sanat eseri",
    },
    Word {
        word: "PROJECT",
        letter_count: 7,
        hint: "Proje - planlanan ve yürütülen iş",
    },
    Word {
        word: "LIBRARY",
        letter_count: 7,
        hint: "Kütüphane - kitapların toplandığı yer",
    },
    Word {
        word: "MORNING",
        letter_count: 7,
        hint: "Sabah - günün ilk saatleri",
    },
    // 8-letter words (10 words)
    Word {
        word: "LANGUAGE",
        letter_count: 8,
        hint: "Dil - iletişim aracı, konuşma sistemi",
    },
    Word {
        word: "HOMEWORK",
        letter_count: 8,
        hint: "Ödev - evde yapılan ders çalışması",
    },
    Word {
        word: "HOSPITAL",
        letter_count: 8,
        hint: "Hastane - hastaların tedavi edildiği kurum",
    },
    Word {
        word: "EXERCISE",
        letter_count: 8,
        hint: "Egzersiz - fiziksel veya zihinsel çalışma",
    },
    Word {
        word: "COMPUTER",
        letter_count: 8,
        hint: "Bilgisayar - elektronik hesaplama ve veri işleme cihazı",
    },
    Word {
        word: "BUILDING",
        letter_count: 8,
        hint: "Bina - insanların yaşadığı veya çalıştığı yapı",
    },
    Word {
        word: "LEARNING",
        letter_count: 8,
        hint: "Öğrenme - bilgi ve beceri edinme süreci",
    },
    Word {
        word: "QUESTION",
        letter_count: 8,
        hint: "Soru - bilgi almak için sorulan cümle",
    },
    Word {
        word: "SUNSHINE",
        letter_count: 8,
        hint: "Güneş ışığı - güneşten gelen aydınlatma",
    },
    Word {
        word: "NOTEBOOK",
        letter_count: 8,
        hint: "Defter - yazı yazmak için kullanılan kağıt demeti",
    },
    // 9-letter words (10 words)
    Word {
        word: "VOLUNTEER",
        letter_count: 9,
        hint: "Gönüllü - karşılıksız yardım eden kişi",
    },
    Word {
        word: "INTERVIEW",
        letter_count: 9,
        hint: "Röportaj / mülakat - soru-cevap görüşmesi",
    },
    Word {
        word: "EDUCATION",
        letter_count: 9,
        hint: "Eğitim - öğretim ve öğrenme süreci",
    },
    Word {
        word: "ADVENTURE",
        letter_count: 9,
        hint: "Macera - heyecan verici deneyim",
    },
    Word {
        word: "YESTERDAY",
        letter_count: 9,
        hint: "Dün - bugünden bir gün önce",
    },
    Word {
        word: "AFTERNOON",
        letter_count: 9,
        hint: "Öğleden sonra - öğle ile akşam arası",
    },
    Word {
        word: "DANGEROUS",
        letter_count: 9,
        hint: "Tehlikeli - risk içeren, zararlı olabilecek",
    },
    Word {
        word: "APARTMENT",
        letter_count: 9,
        hint: "Daire - büyük binanın içindeki konut",
    },
    Word {
        word: "KNOWLEDGE",
        letter_count: 9,
        hint: "Bilgi - öğrenilen ve bilinen şeyler",
    },
    Word {
        word: "CAREFULLY",
        letter_count: 9,
        hint: "Dikkatlice - özenli ve dikkatli bir şekilde",
    },
    // 10-letter words (10 words)
    Word {
        word: "TECHNOLOGY",
        letter_count: 10,
        hint: "Teknoloji - bilimsel gelişmeler ve uygulamalar",
    },
    Word {
        word: "TELEVISION",
        letter_count: 10,
        hint: "Televizyon - görüntülü yayın cihazı",
    },
    Word {
        word: "DICTIONARY",
        letter_count: 10,
        hint: "Sözlük - kelimelerin anlamlarını açıklayan kitap",
    },
    Word {
        word: "POPULATION",
        letter_count: 10,
        hint: "Nüfus - bir bölgede yaşayan insan sayısı",
    },
    Word {
        word: "DIFFERENCE",
        letter_count: 10,
        hint: "Fark - iki şey arasındaki ayrım",
    },
    Word {
        word: "UNIVERSITY",
        letter_count: 10,
        hint: "Üniversite - yüksek öğretim kurumu",
    },
    Word {
        word: "IMPORTANCE",
        letter_count: 10,
        hint: "Önem - bir şeyin değeri ve anlamlılığı",
    },
    Word {
        word: "SMARTPHONE",
        letter_count: 10,
        hint: "Akıllı telefon - internet bağlantılı mobil cihaz",
    },
    Word {
        word: "GOVERNMENT",
        letter_count: 10,
        hint: "Hükümet - ülkeyi yöneten resmi kurum",
    },
    Word {
        word: "BASKETBALL",
        letter_count: 10,
        hint: "Basketbol - potaya top atma sporu",
    },
];

/// Check if the database has already been seeded
/// Returns true if default category exists
fn is_database_seeded(conn: &Connection) -> Result<bool> {
    let count: i32 = conn.query_row(
        "SELECT COUNT(*) FROM categories WHERE is_default = 1",
        [],
        |row| row.get(0),
    )?;
    Ok(count > 0)
}

/// Insert the default category "Genel Kelimeler"
/// Returns the category ID
fn insert_default_category(conn: &Connection) -> Result<i64> {
    conn.execute(
        "INSERT INTO categories (name, emoji, description, is_default)
         VALUES (?1, ?2, ?3, 1)",
        [
            "Genel Kelimeler",
            "📦",
            "Günlük yaşamda sık kullanılan genel kelimeler - İngilizce öğrenimi için temel kelimeler",
        ],
    )?;

    Ok(conn.last_insert_rowid())
}

/// Insert all 70 default words for the given category
fn insert_default_words(conn: &Connection, category_id: i64) -> Result<()> {
    let mut stmt = conn.prepare(
        "INSERT INTO words (category_id, word, letter_count, hint)
         VALUES (?1, ?2, ?3, ?4)",
    )?;

    for word in DEFAULT_WORDS {
        stmt.execute([
            &category_id.to_string(),
            word.word,
            &word.letter_count.to_string(),
            word.hint,
        ])?;
    }

    Ok(())
}

/// Insert default application settings
fn insert_default_settings(conn: &Connection) -> Result<()> {
    let settings = [
        ("sound_enabled", "true"),
        ("default_time", "300"),
        ("default_guesses", "3"),
        ("animation_speed", "normal"),
    ];

    let mut stmt = conn.prepare("INSERT INTO settings (key, value) VALUES (?1, ?2)")?;

    for (key, value) in &settings {
        stmt.execute([key, value])?;
    }

    Ok(())
}

/// Run all seeding operations in a transaction
///
/// This function is idempotent - it will only seed if the database is empty.
/// All operations are wrapped in a transaction for atomicity.
pub fn seed_database(conn: &Connection) -> Result<()> {
    // Check if already seeded
    if is_database_seeded(conn)? {
        println!("Database already seeded, skipping...");
        return Ok(());
    }

    println!("Seeding database with default data...");

    // Begin transaction
    conn.execute_batch("BEGIN TRANSACTION;")?;

    match seed_database_internal(conn) {
        Ok(_) => {
            conn.execute_batch("COMMIT;")?;
            println!("Database seeding completed successfully!");
            Ok(())
        }
        Err(e) => {
            conn.execute_batch("ROLLBACK;")?;
            Err(e)
        }
    }
}

/// Internal seeding logic (executed within transaction)
fn seed_database_internal(conn: &Connection) -> Result<()> {
    // Insert default category
    let category_id = insert_default_category(conn)?;
    println!("Created default category with ID: {}", category_id);

    // Insert all 70 words
    insert_default_words(conn, category_id)?;
    println!("Inserted 70 words");

    // Insert default settings
    insert_default_settings(conn)?;
    println!("Inserted default settings");

    // Verify word counts by letter
    verify_word_distribution(conn, category_id)?;

    Ok(())
}

/// Verify that each letter count has exactly 10 words
fn verify_word_distribution(conn: &Connection, category_id: i64) -> Result<()> {
    for letter_count in 4..=10 {
        let count: i32 = conn.query_row(
            "SELECT COUNT(*) FROM words WHERE category_id = ?1 AND letter_count = ?2",
            [&category_id.to_string(), &letter_count.to_string()],
            |row| row.get(0),
        )?;

        if count != 10 {
            return Err(rusqlite::Error::InvalidQuery);
        }

        println!("Verified: {} words with {} letters", count, letter_count);
    }

    Ok(())
}
