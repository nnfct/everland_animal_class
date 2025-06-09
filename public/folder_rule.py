import os

# --- 설정값 ---
folder_path = "C:/Users/USER/Downloads/OneDrive_2025-06-09/바위너구리"  # 실제 파일이 있는 폴더 경로로 변경하세요.
new_prefix = "ro"  # 새 파일명에 붙일 접두사 (예: m, photo, doc)
start_number = 1   # 시작할 숫자 (예: m1, m2, m3)
number_padding = 0 # 숫자를 몇 자리로 채울지 (예: 0이면 1, 2, 3... / 3이면 001, 002, 003...)
                   # 0으로 두면 m1, m2, m3.. 이 됩니다.
                   # 3으로 두면 m001, m002, m003.. 이 됩니다.

# --- 메인 로직 ---

try:
    # 1. 폴더 내의 모든 파일 목록 가져오기
    # 숨김 파일이나 폴더는 제외하고 실제 파일만 대상으로 합니다.
    files_in_folder = []
    for item in os.listdir(folder_path):
        item_full_path = os.path.join(folder_path, item)
        if os.path.isfile(item_full_path):
            files_in_folder.append(item)

    # 2. 파일 목록을 이름 순서로 정렬
    files_in_folder.sort() # 기본적으로 알파벳/숫자 순으로 정렬됩니다.

    # 3. 각 파일의 이름 변경
    current_number = start_number
    for old_filename in files_in_folder:
        old_full_path = os.path.join(folder_path, old_filename)

        # 파일 확장자 분리
        name_without_ext, extension = os.path.splitext(old_filename)

        # 새 파일 이름 생성
        if number_padding > 0:
            new_filename = f"{new_prefix}{current_number:0{number_padding}d}{extension}"
        else:
            new_filename = f"{new_prefix}{current_number}{extension}"

        new_full_path = os.path.join(folder_path, new_filename)

        # 중복 파일명 체크 (매우 중요!)
        if os.path.exists(new_full_path) and old_full_path != new_full_path:
            print(f"경고: {new_filename}이(가) 이미 존재합니다. 이 파일은 건너뜁니다.")
            continue # 다음 파일로 넘어감

        # 파일 이름 변경 실행
        os.rename(old_full_path, new_full_path)
        print(f"'{old_filename}' -> '{new_filename}' 변경 완료")

        current_number += 1

    print("\n모든 파일 이름 변경이 완료되었습니다.")

except FileNotFoundError:
    print(f"오류: 지정된 폴더 '{folder_path}'를 찾을 수 없습니다. 경로를 확인해주세요.")
except PermissionError:
    print(f"오류: 폴더 '{folder_path}'에 접근 권한이 없습니다. 관리자 권한으로 실행하거나 권한을 확인해주세요.")
except Exception as e:
    print(f"예상치 못한 오류 발생: {e}")