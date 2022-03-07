import { HStack, Link } from "@chakra-ui/react";
import { useCallback } from "react";
import QuizState from "../utils/QuizState";
import { useQuizStateContext } from "../contexts/QuizStateContextProvider";
import { LINK_HACKATHON_MAIN_PAGE, LINK_HOW_TO_TEST_PAGE } from "../CustomInputs";

function NavLink({
  text,
  href,
  target,
  onClick
}: {
  text: string,
  href?: string,
  target?: string,
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
  const { setCurrentQuizState } = useQuizStateContext();
  const onClickTopPage = useCallback(() => {
    setCurrentQuizState(QuizState.TOP);
  }, [ setCurrentQuizState ]);

  const LinkInfo = [
    {
      text: "事前テストトップページ",
      onClick: onClickTopPage,
    },
    { 
      text: "ハッカソンメインページ", 
      href: LINK_HACKATHON_MAIN_PAGE,
      target: '_blank', 
    },
    { 
      text: "テスト受講方法", 
      href: LINK_HOW_TO_TEST_PAGE, 
      target: '_blank', 
    }
  ];

  return (
    <HStack as={"nav"} spacing={4} marginTop={4} marginBottom={4}>
      {LinkInfo.map(({ text, href, onClick, target }, index) => (
        <NavLink
          key={`${text}-${index}`}
          text={text}
          href={href}
          target={target}
          onClick={onClick}
        />
      ))}
    </HStack>
  );
}

export default Navigation;
