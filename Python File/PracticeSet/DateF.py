from dateparser.search import search_dates

def extract_all_datetimes(sentence):
    results = search_dates(sentence)
    return results

# Example usage
sentence = "We have meetings on 15th August 2025 at 3:30 PM and again on September 1st at 10:00 AM."
results = extract_all_datetimes(sentence)

if results:
    for original_text, parsed_dt in results:
        print(f"Found '{original_text}' -> {parsed_dt}")
else:
    print("No date/time found in the sentence.")
