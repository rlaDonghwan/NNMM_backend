import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateChartDto {
  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsNumber() // 숫자인지 확인
  years?: number[] // 연도

  @IsString() // 문자열인지 확인
  chartType: string // 차트 유형

  @IsArray() // 배열인지 확인
  targetDataKeys: string[] // 대상 데이터 키 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열인지 확인
  colorSet?: string[] // 색상 세트 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열인지 확인
  labels?: string[] // 레이블 배열

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsNumber() // 숫자인지 확인
  order?: number // 순서

  @IsOptional() // 선택적 필드 (값이 없어도 유효)
  @IsArray() // 배열인지 확인
  units?: string[] // 단위 배열

  @IsOptional()
  @IsString()
  title?: string // 차트 제목

  @IsString()
  category: string
}
