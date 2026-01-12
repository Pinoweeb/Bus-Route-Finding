## Hướng dẫn tạo Database

### 1. Yêu cầu
- PostgreSQL
### 2. Tạo database từ schema
- Mở pgAdmin4
- Chuột phải vào 'Database'
- Chọn 'Create', 'Database'
- Đặt tên là 'bus_route_db'
- Lần lượt chạy 'bus.sql', 'setup-route-stops.sql'
- Chọn 1 trong 3 dataset 'am', 'md', 'pm'
- Import lần lượt dataset theo thứ tự 'routes', 'stops', 'trips', 'stop_times'(Format: csv; Encoding: UTF8, Bật 'header')
- Chạy 'chuanhoa_data.sql'
- Chạy 'user.sql'

## Database Schema

### Các bảng chính:

- **routes**: Thông tin tuyến bus (route_id, route_code, route_name, description)
- **stops**: Điểm dừng (stop_id, stop_name, latitude, longitude, address)
- **route_stops**: Mối quan hệ giữa tuyến và điểm dừng (route_id, stop_id, stop_sequence)
- **trips**: Các chuyến xe (trip_id, route_id, service_type, start_time)
- **stop_times**: Lịch trình tại mỗi điểm dừng (trip_id, stop_id, arrival_time, departure_time)

## Dữ liệu

- Nguồn: GTFS Hà Nội (3 khung giờ: AM, MD, PM)
- Tổng số tuyến: Xem từ file `db/schema/bus.sql`
- Tổng số điểm dừng: Xem từ file `db/schema/bus.sql`

## Tiếp tục phát triển

### Bước tới:
1. Viết API endpoints REST
2. Tối ưu queries và thêm indexes
3. Viết unit tests
4. Deploy lên production

## Liên hệ

Dự án BUS_PROJECT - Backend 1
Tháng 12, 2025
