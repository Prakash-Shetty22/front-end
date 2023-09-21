import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import './Select.css';

export default function SelectLabels(props) {

  return (
    <div className='select'>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">{props.label}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props.value}
          label={props.label}
          onChange={props.onChange}
          autoWidth
          className='dropdown'
        >
          <MenuItem value="">
            <em>Select Your Choice</em>
          </MenuItem>
          {props.lists.map( (list) => 
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          )}
        </Select>
        <FormHelperText className='helpertext'>Select Your Choice</FormHelperText>
      </FormControl>
    </div>
  );
}