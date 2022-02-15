import { HStack, Link } from "@chakra-ui/react";
import { useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";

function NavLink({
  text,
  href,
  target,
  onClick
}: {
  text: string,
  href?: string
  target?: '_blank'
  onClick?: () => void,
}) {
  return (
    <Link
      px={2}
      rounded={"md"}
      color="white"
      textShadow="0 0 2px #0972AF"
      textDecoration="underline"
      _hover={{ bg: "#43768f" }}
      _active={{ bg: "#325a6e" }}
      href={href}
      target={target}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}

function Navigation() {
  const { setCurrentQuizState } = useQuizContext();

  const LinkInfo = [
    {
      text: "事前テストトップページ",
      onClick: () => setCurrentQuizState(QuizState.TOP)
    },
    { text: "ハッカソンメインページ", href: "#" },
    { text: "テスト受講方法", href: "#" }
  ];

  return (
    <HStack as={"nav"} spacing={4} marginTop={4} marginBottom={4}>
      {LinkInfo.map(({ text, href, onClick }, index) => (
        <NavLink
          key={`${text}-${index}`}
          text={text}
          href={href}
          onClick={onClick}
        />
      ))}
    </HStack>
  );
}

export default Navigation;
