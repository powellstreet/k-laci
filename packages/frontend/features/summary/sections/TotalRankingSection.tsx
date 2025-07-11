'use client';

import { TotalRegionRank } from '@/api/types/stats.types';
import SearchInput from '@/components/atoms/SearchInput';
import RadarJewelChartMini from '@/components/atoms/charts/RadarJewelChartMini';
import { generateChartData } from '@/utils/chartUtils';
import { parseKlaciCodeWithNickname } from '@/utils/klaciCodeUtils';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';

// 컬럼 너비 설정을 위한 상수
const COLUMN_WIDTHS = {
  rank: '0 0 42px',
  regionName: '0 0 120px',
  jewel: '0 0 60px',
  type: '0 0 80px',
  klaciCode: '1 1 420px',
  strengthIndexes: '1 1 360px',
  weightClass: '0 0 60px',
  totalScore: '0 0 60px',
} as const;

// KLACI 코드 시각화 컴포넌트
const KlaciCodeVisualizer: React.FC<{ klaciCode: string }> = ({
  klaciCode,
}) => {
  const parsedCodes = parseKlaciCodeWithNickname(klaciCode);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      {parsedCodes.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          {/* 원 */}
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {item.code}
          </div>
          {/* 텍스트 */}
          <span
            style={{
              fontSize: '13px',
              color: item.color === '#D9D9E8' ? '#000' : item.color,
            }}
          >
            {item.nickname}
          </span>
        </div>
      ))}
    </div>
  );
};

// 타이틀과 검색창을 별도 컴포넌트로 분리
const SectionHeader: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}> = ({ searchTerm, onSearchChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0 40px',
        marginBottom: '30px',
      }}
    >
      {/* 좌상단: 제목과 안내 문구 */}
      <div>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px',
          }}
        >
          종합순위 TOP 100
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            lineHeight: '1.4',
          }}
        >
          (*5극3특, 광역별, 유형별 종합순위 등 다양한 레이블로 구성된 순위가 다음주에 추가 공개됩니다.)
        </p>
      </div>

      {/* 우측: 검색창 */}
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="지역 검색"
      />
    </div>
  );
};

// 메인 테이블 컴포넌트
const RankingTable: React.FC<{ data: TotalRegionRank[] }> = ({ data }) => {
  const router = useRouter();

  // 지역 클릭 핸들러 - path parameter 방식으로 변경
  const handleRegionClick = useCallback(
    (regionId: number) => {
      router.push(`/results/region/${regionId}`);
    },
    [router],
  );

  return (
    <div style={{ padding: '0 40px' }}>
      {/* 테이블 헤더 */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#333',
        }}
      >
        <div style={{ flex: COLUMN_WIDTHS.rank }}>순위</div>
        <div style={{ flex: COLUMN_WIDTHS.regionName }}>지자체명</div>
        <div style={{ flex: COLUMN_WIDTHS.jewel }}>원석</div>
        <div style={{ flex: COLUMN_WIDTHS.type }}>유형명</div>
        <div style={{ flex: COLUMN_WIDTHS.klaciCode }}>유형코드</div>
        <div style={{ flex: COLUMN_WIDTHS.strengthIndexes }}>
          강점지표 TOP 3
        </div>
        <div style={{ flex: COLUMN_WIDTHS.weightClass }}>체급</div>
        <div style={{ flex: COLUMN_WIDTHS.totalScore }}>종합점수</div>
      </div>

      {/* 테이블 데이터 */}
      {data.map((item, index) => {
        // 차트 데이터 생성
        const chartData = generateChartData(item.region);

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              marginBottom: '8px',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid #000';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.backgroundColor = 'white';
            }}
            onClick={() => handleRegionClick(item.region_id)}
          >
            {/* 순위 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.rank,
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {item.total_rank}위
            </div>

            {/* 지자체명 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.regionName,
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              {item.region.province.name} {item.region.name}
            </div>

            {/* 원석 - RadarJewelChartMini 사용 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.jewel,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RadarJewelChartMini
                data={chartData}
                size={48}
                imageUrl="/backgrounds/radar_chart_bg.png"
                hideBackground={true} // 배경 숨기기 옵션 추가
              />
            </div>

            {/* 유형명 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.type,
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {item.region.klaci?.type || '-'}
            </div>

            {/* 유형코드 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.klaciCode,
                fontSize: '16px',
              }}
            >
              <KlaciCodeVisualizer klaciCode={item.region.klaci.code} />
            </div>

            {/* 강점지표 TOP 3 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.strengthIndexes,
                display: 'flex',
                gap: '4px',
                fontSize: '16px',
              }}
            >
              {item.strength_indexes_details
                .slice(0, 3)
                .map((strength, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#333',
                    }}
                  >
                    {strength.name}
                  </span>
                ))}
            </div>

            {/* 체급 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.weightClass,
                fontSize: '14px',
              }}
            >
              {item.region.weight_class}급
            </div>

            {/* 종합점수 */}
            <div
              style={{
                flex: COLUMN_WIDTHS.totalScore,
                color: '#000',
                fontSize: '14px',
              }}
            >
              {item.total_score.toFixed(3)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 메인 컴포넌트
const TotalRankingSection: React.FC<{ data: TotalRegionRank[] }> = ({
  data,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce 함수
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300), // 300ms 딜레이
    [debounce],
  );

  // 검색어 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchTerm(value); // 즉시 UI 업데이트
    debouncedSearch(value); // 디바운스된 필터링
  };

  // 검색어에 따른 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return data.filter((item) => {
      const fullName =
        `${item.region.province.name} ${item.region.name}`.toLowerCase();
      return fullName.includes(searchLower);
    });
  }, [data, debouncedSearchTerm]);

  return (
    <div
      style={{
        width: '100%',
        padding: '40px 0',
      }}
    >
      <SectionHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filteredCount={filteredData.length}
        totalCount={data.length}
      />
      <RankingTable data={filteredData} />
    </div>
  );
};

export default TotalRankingSection;
