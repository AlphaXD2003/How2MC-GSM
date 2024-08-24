
const TickText = ({text}: {text:string}) => {
  return (
    <div className="flex flex-row items-center justify-center">
        <div>
            <img src="/images/check-circle.svg" />
        </div>
        <div className="dark:text-white text-black font-semibold">{text}</div>
    </div>
  )
}

export default TickText