/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://klaci.kr', // 실제 배포 도메인으로 변경
  generateRobotsTxt: true, // robots.txt 자동 생성
  robotsTxtOptions: {
    additionalSitemaps: ['https://klaci.kr/sitemap.xml'],
  },
};
