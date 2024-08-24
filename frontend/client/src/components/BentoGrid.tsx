import { cn } from "@/utils/cn";
import Divider from "@mui/material/Divider";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export function BentoGridSecondDemo() {
  return (
    <div className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      <div className="mt-4 lg:text-3xl text-xl mb-4 flex text-[var(--secondary-color)]">
        <Root>
          <Divider textAlign="center">
            {/* Why How2MC GSM ? */}
            <p className="text-3xl mx-auto roboto-slab-600 dark:text-[var(--secondary-color)] ">
              Why How2MC GSM ?
            </p>
          </Divider>
        </Root>
      </div>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
const Skeleton = ({ src }: { src: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },2000)
  })
  return loading ? (
    <div>
      <div className="flex  flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
    </div>
  ) : (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black">
      <img className="w-auto" src={src} />
    </div>
  );
};
const items = [
  {
    title: "Top notch Hardware",
    description:
      "The hardware we are giving is top notch in production. We are giving Ryzen9 7950x CPU with DDR5 RAM.",
    header: <Skeleton src="/images/pexels-brett-sayles-2425567.jpg" />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Variety Of supported games",
    description:
      "We support a variety of games, including popular titles like Fortnite, Apex Legends, and League of Legends.",
    header: <Skeleton src="/images/pexels-jeshoots-com-147458-442576.jpg" />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Variety of Locations",
    description: "We provide a variety of locations to explore and enjoy.",
    header: <Skeleton src="/images/pexels-marina-zasorina-7635156.jpg" />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "24/7 Support",
    description:
      "We offer 24/7 support to ensure that you have the best possible experience.",

    header: <Skeleton src="/images/pexels-divinetechygirl-1181472.jpg" />,
    className: "md:col-span-1",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Cheap Price",
    description:
      "We offer a very affordable price for our services, making it accessible to everyone.",

    header: <Skeleton src="/images/pexels-karolina-grabowska-5650046.jpg" />,
    className: "md:col-span-1",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
