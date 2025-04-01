import { IsArray, IsString } from 'class-validator' // 유효성 검사를 위한 데코레이터 import

export class CreateEsgReportDto {
  @IsString() userId: string // 사용자 ID (문자열)
  @IsString() companyName: string // 회사 이름
  @IsString() category: 'social' | 'environmental' | 'governance' // ESG 카테고리
  @IsString() chartConfigId: string // 차트 설정 ID
  @IsArray() years: number[] // 연도 배열
  @IsArray() rows: any[] // 입력 데이터 배열 (지표 값 등)
}
