'use client';

import { useRegion } from '@/api/hooks/useRegion';
import ResultLayout from '@/components/layout/ResultLayout';
import {
  useDistrict,
  useIsLoggedIn,
  useSetSelectedDistrict,
  useSetSelectedProvince,
  useSetSelectedRegion,
} from '@/store';
import { RegionWithDetails as StoreRegionWithDetails } from '@/store/types/district';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

// sections
import CategoryRankingSection from '@/features/results/sections/CategoryRankingSection';
import CompetencyDistSection from '@/features/results/sections/CompetencyDistSection';
import DistrictSearchSection from '@/features/results/sections/DistrictSearchSection';
import DistrictSelectSection from '@/features/results/sections/DistrictSelectSection';
import PreRegistrationSection from '@/features/results/sections/PreRegistrationSection';
import StrengthWeaknessIndexSection from '@/features/results/sections/StrenthWeaknessIndexSection';
import SummarySection from '@/features/results/sections/SummarySection';
import TitleSection from '@/features/results/sections/TitleSection';

// 지자체 데이터 타입 정의
interface DistrictData {
  id: string;
  name: string;
  rank: number;
  // 필요한 다른 데이터들...
}

// API 응답을 store 타입으로 변환하는 함수
const transformApiRegionToStoreRegion = (
  apiRegion: any,
): StoreRegionWithDetails => {
  return {
    id: parseInt(apiRegion.id),
    province_id: parseInt(apiRegion.provinceId),
    name: apiRegion.name,
    district_type: apiRegion.district_type,
    weight_class: apiRegion.weight_class,
    klaci_code: apiRegion.klaci_code,
    growth_score: apiRegion.growth_score,
    economy_score: apiRegion.economy_score,
    living_score: apiRegion.living_score,
    safety_score: apiRegion.safety_score,
    total_score: apiRegion.total_score,
    total_rank: apiRegion.total_rank,
    province: {
      id: parseInt(apiRegion.province.id),
      name: apiRegion.province.name,
    },
    klaci: apiRegion.klaci,
    category_ranks: apiRegion.category_ranks,
    key_index_ranks: apiRegion.key_index_ranks,
  };
};

// 실제 페이지 컴포넌트
function ResultsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSelectedDistrict = useSetSelectedDistrict();
  const setSelectedProvince = useSetSelectedProvince();
  const setSelectedRegion = useSetSelectedRegion();
  const [isFloating, setIsFloating] = useState(false);
  const [districtData, setDistrictData] = useState<DistrictData | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const hasAnimatedRef = useRef(false);
  const [hasLoadedDefault, setHasLoadedDefault] = useState(false);

  // Zustand store에서 선택된 지역 정보 가져오기
  const { selectedProvince, selectedDistrict, selectedRegion } = useDistrict();
  const { getRegion } = useRegion();

  // 기본 데이터 로드 함수
  const loadDefaultData = async () => {
    if (hasLoadedDefault) return;

    try {
      const apiResponse = await getRegion('1');
      const storeRegion = transformApiRegionToStoreRegion(apiResponse);
      setSelectedRegion(storeRegion);
      setSelectedProvince(storeRegion.province_id);
      setSelectedDistrict(storeRegion.id);
      setHasLoadedDefault(true);
    } catch (error) {
      // 기본 데이터 로드 실패 시 무시
    }
  };

  // URL 업데이트 함수
  const updateURL = (regionId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (regionId) {
      params.set('regionId', regionId.toString());
    } else {
      params.delete('regionId');
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    if (newURL !== window.location.pathname + window.location.search) {
      router.replace(newURL, { scroll: false });
    }
  };

  // selectedRegion이 변경될 때 URL 업데이트
  useEffect(() => {
    if (selectedRegion) {
      updateURL(selectedRegion.id);
    } else {
      updateURL(null);
    }
  }, [selectedRegion]);

  // URL에서 regionId 읽어와서 상태 업데이트
  useEffect(() => {
    const regionId = searchParams.get('regionId');

    if (
      regionId &&
      (!selectedRegion || selectedRegion.id !== Number(regionId))
    ) {
      // URL에 regionId가 있고, 현재 selectedRegion과 다른 경우에만 API 호출
      const fetchRegionFromURL = async () => {
        try {
          const apiResponse = await getRegion(regionId);
          const storeRegion = transformApiRegionToStoreRegion(apiResponse);
          setSelectedRegion(storeRegion);
          setSelectedProvince(storeRegion.province_id);
          setSelectedDistrict(storeRegion.id);
        } catch (error) {
          console.error('Failed to fetch region from URL:', error);
          // 실패 시 기본 데이터 로드
          if (!hasLoadedDefault) {
            loadDefaultData();
          }
        }
      };

      fetchRegionFromURL();
    } else if (!regionId && !selectedRegion && !hasLoadedDefault) {
      // URL에 regionId가 없고 selectedRegion도 없고 아직 기본 데이터를 로드하지 않은 경우
      loadDefaultData();
    }
  }, [searchParams]);

  // 안전한 지역명 생성 함수
  const getDistrictName = (): string => {
    if (selectedRegion?.province?.name && selectedRegion?.name) {
      return `${selectedRegion.province.name} ${selectedRegion.name}`;
    }
    if (selectedProvince?.name && selectedDistrict?.name) {
      return `${selectedProvince.name} ${selectedDistrict.name}`;
    }
    return '전라북도 전주시';
  };

  // 지자체 데이터 동적 생성
  const generateDistrictData = (): DistrictData => {
    const districtName = getDistrictName();
    const rank = selectedRegion?.total_rank || 3;

    return {
      id: 'current-district',
      name: districtName,
      rank: rank,
    };
  };

  // selectedRegion이 변경될 때마다 districtData 업데이트
  useEffect(() => {
    const newDistrictData = generateDistrictData();
    setDistrictData(newDistrictData);
  }, [selectedRegion, selectedProvince, selectedDistrict]);

  // 스크롤 이벤트 핸들러 수정
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 400; // 200에서 400으로 증가
      const scrollY = window.scrollY;
      const newIsFloating = scrollY > scrollThreshold;

      setIsFloating(newIsFloating);

      if (newIsFloating && !hasAnimatedRef.current) {
        // floating 상태가 되었을 때만 애니메이션 실행 (한 번만)
        setShowAnimation(true);
        hasAnimatedRef.current = true;
      } else if (!newIsFloating && hasAnimatedRef.current) {
        // floating 상태가 해제되면 애니메이션 상태 리셋
        hasAnimatedRef.current = false;
        setShowAnimation(false);
      }
    };

    // 컴포넌트 마운트 시 초기 상태 설정
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 의존성 배열을 비워서 한 번만 등록

  // 애니메이션 완료 후 클래스 제거
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // 디버깅용 useEffect 추가
  useEffect(() => {
    console.log('isFloating changed:', isFloating);
  }, [isFloating]);

  return (
    <ResultLayout>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F4F4F4',
          gap: '30px',
        }}
      >
        <DistrictSearchSection />

        {/* floating 상태에 따라 다른 스타일로 DistrictSelectSection 렌더링 */}
        <DistrictSelectSection isFloating={isFloating} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            background: '#F4F4F4',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '60%',
              maxWidth: '800px',
              gap: '50px',
              paddingTop: '100px',
            }}
          >
            <TitleSection districtData={districtData} />
            <SummarySection />

            {/* StrengthWeaknessIndexSection과 상단 컴포넌트 사이 간격 */}
            <div style={{ height: '80px' }} />

            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {isLoggedIn ? (
              // 로그인된 사용자: 모든 섹션 표시
              <>
                <StrengthWeaknessIndexSection />
                <CompetencyDistSection />
                <CategoryRankingSection />
                <div
                  style={{
                    width: '100vw',
                    marginLeft: 'calc(-50vw + 50%)',
                    marginRight: 'calc(-50vw + 50%)',
                  }}
                >
                  <PreRegistrationSection />
                </div>
              </>
            ) : (
              // 비로그인 사용자: StrengthWeaknessIndexSection만 부분 표시 (fadeout 효과)
              <>
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(to bottom, rgba(244, 244, 244, 0) 0%, rgba(244, 244, 244, 0) 30%, rgba(244, 244, 244, 0.9) 40%, rgba(244, 244, 244, 1) 100%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 0 }}>
                    <StrengthWeaknessIndexSection />
                  </div>
                </div>
                {/* LoginSuggestionSection과의 간격 */}
                <div style={{ height: '100px' }} />
              </>
            )}
          </div>
        </div>
      </div>
    </ResultLayout>
  );
}

// 로딩 컴포넌트
function ResultsPageLoading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid #000000',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function ResultsPageClient() {
  return (
    <Suspense fallback={<ResultsPageLoading />}>
      <ResultsPageContent />
    </Suspense>
  );
}
