import { RootState } from '@/store/store';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';

const AvatarComponent = ({ size} : { size: string}) => {
    const user =  useSelector((state : RootState) => state.user.user)
  return (
    <Avatar name={`${user.firstName} ${user.lastName}`} round={true} size={size} />
  )
}

export default AvatarComponent