import os
import csv
from urllib.parse import urlparse

def merge():
    csv_directory = 'D:/dong/csvs/'
    result_file = os.path.join(csv_directory, 'result.csv')
    urls = set()
    # 遍历csv目录下的所有文件
    for filename in os.listdir(csv_directory):
        if filename.endswith('.csv'):
            filepath = os.path.join(csv_directory, filename)
            with open(filepath, 'r', newline='') as file:
                reader = csv.reader(file)
                for row in reader:
                    for item in row:
                        parsed_url = urlparse(item)
                        if parsed_url.scheme and parsed_url.netloc:
                            urls.add(item)

    # 将去重后的URL链接写入result.csv文件
    with open(result_file, 'w', newline='') as file:
        writer = csv.writer(file)
        for url in urls:
            writer.writerow([url])

    print(f"URLs merged and saved to {result_file} successfully!")

if __name__ == '__main__':
    merge()

