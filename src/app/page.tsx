import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream-100">
      <div className="mx-auto max-w-lg px-6 py-12">
        <header className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium tracking-wide text-coral-500">
            진로 탐색 테스트
          </p>
          <h1 className="mb-4 text-4xl font-bold text-brown-700">나 뭐하지?</h1>
          <p className="text-lg leading-relaxed text-brown-600">
            아이를 키운 후, 다시 시작하는 나를 위한
            <br />
            진로 탐색 테스트
          </p>
        </header>

        <section className="mb-10 space-y-5 rounded-3xl bg-white p-8 shadow-sm">
          <p className="leading-relaxed text-brown-700">
            아이를 키우다 보면 문득 이런 생각이 듭니다.
            <br />
            <span className="font-medium text-brown-800">
              &ldquo;아이들이 조금 더 크면 나는 무엇을 하며 살아갈까?&rdquo;
            </span>
          </p>
          <p className="leading-relaxed text-brown-600">
            누군가는 전문성을 쌓는 일이 잘 맞고, 누군가는 콘텐츠를 만들거나,
            창업하거나, 자유롭게 프로젝트를 하는 방식이 더 잘 맞습니다.
          </p>
          <p className="leading-relaxed text-brown-600">
            이 테스트는 당신의 성향과 현재 상황을 바탕으로 앞으로의 가능성을
            살펴보는 무료 진로 탐색 도구입니다. 정답을 알려주는 검사가 아니라,
            다음 한 걸음을 찾기 위한 힌트를 제공합니다.
          </p>
        </section>

        <div className="mb-8 flex justify-center gap-6 text-sm text-brown-500">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-beige-200 text-xs font-semibold text-brown-600">
              24
            </span>
            <span>문항</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-beige-200 text-xs font-semibold text-brown-600">
              5
            </span>
            <span>분</span>
          </div>
        </div>

        <Link
          href="/test"
          className="block w-full rounded-2xl bg-coral-500 py-4 text-center text-lg font-semibold text-white shadow-md transition-all hover:bg-coral-600 hover:shadow-lg active:scale-[0.98]"
        >
          무료 테스트 시작하기
        </Link>

        <p className="mt-8 text-center text-xs leading-relaxed text-brown-400">
          이 테스트는 자기이해와 진로 탐색을 돕기 위한 참고용 도구입니다.
          <br />
          의학적, 임상적 진단을 목적으로 하지 않습니다.
        </p>
      </div>
    </main>
  );
}
