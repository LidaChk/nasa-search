import { useDispatch, useSelector } from 'react-redux';
import { isItemSelectedById } from '../../store/selectedItemsSlice/selectors';
import {
  addItem,
  removeItem,
} from '../../store/selectedItemsSlice/selectedItemsSlice';
import { SearchResultItem } from '../../types/types';
import { selectItemFromQueries } from '../../store/nasaApi/nasaSelectors';

import './checkbox.css';

interface CheckBoxProps {
  nasaId: string;
}

const CheckBox = ({ nasaId }: CheckBoxProps) => {
  const dispatch = useDispatch();
  const isChecked = useSelector(isItemSelectedById(nasaId));
  const item = useSelector(selectItemFromQueries(nasaId));

  const handleCheckboxChange = (item?: SearchResultItem) => {
    if (!item) {
      return;
    }
    if (isChecked) {
      dispatch(removeItem(item));
    } else {
      dispatch(addItem(item));
    }
  };

  console.log({ nasaId, isChecked });

  return (
    <input
      className="checkbox-input"
      type="checkbox"
      id={nasaId}
      checked={isChecked}
      onChange={() => handleCheckboxChange(item)}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export default CheckBox;
