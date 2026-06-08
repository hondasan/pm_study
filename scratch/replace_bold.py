import os
import re

def replace_bold_in_file(file_path, dry_run=True):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # **text** を <strong>text</strong> に置換する正規表現
    # 最短一致にするために .*? を使用
    pattern = r'\*\*(.*?)\*\*'
    
    new_content, count = re.subn(pattern, r'<strong>\1</strong>', content)
    
    if count > 0:
        print(f"{' [DRY RUN]' if dry_run else ''} Modified: {file_path} ({count} replacements)")
        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
    return count

def main():
    target_dir = "/Users/honda/pm_study/src"
    dry_run = True  # まずはテスト実行
    
    print("--- Starting Dry Run ---")
    total_replacements = 0
    modified_files = 0
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.astro'):
                file_path = os.path.join(root, file)
                count = replace_bold_in_file(file_path, dry_run=dry_run)
                if count > 0:
                    total_replacements += count
                    modified_files += 1
                    
    print(f"Total replacements found: {total_replacements} across {modified_files} files.")
    
    # 実際に適用するための切り替え
    if total_replacements > 0 and dry_run:
        print("\n--- Executing Actual Replacement ---")
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                if file.endswith('.astro'):
                    file_path = os.path.join(root, file)
                    replace_bold_in_file(file_path, dry_run=False)

if __name__ == "__main__":
    main()
