import React from 'react';
import { Grid, Form, Input, Field, Button, Message, Select } from '@b-design/ui';
import DrawerWithFooter from '../../../../components/Drawer';
import { If } from 'tsx-control-statements/components';
import { createRole, updateRole } from '../../../../api/roles';
import type { PermPolicies } from '../../../../interface/permPolicies';
import type { RolesBase } from '../../../../interface/roles';
import { checkName } from '../../../../utils/common';
import Translation from '../../../../components/Translation';
import locale from '../../../../utils/locale';
import { getSelectLabel } from '../../../../utils/utils';
import i18n from '../../../../i18n';

type Props = {
  visible: boolean;
  isEditRole: boolean;
  editRoleItem: RolesBase;
  permPolicies: PermPolicies[];
  onCreate: () => void;
  onCloseCreate: () => void;
};

type State = {
  loading: boolean;
};

class RolesDialog extends React.Component<Props, State> {
  field: Field;
  constructor(props: Props) {
    super(props);
    this.field = new Field(this);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { isEditRole, editRoleItem } = this.props;
    if (isEditRole && editRoleItem) {
      const { name, alias, permPolicies } = editRoleItem;
      const permPoliciesName = permPolicies?.map((item) => {
        return item.name;
      });
      this.field.setValues({
        name,
        alias,
        permPolicies: permPoliciesName,
      });
    }
  }

  onCloseCreate = () => {
    this.props.onCloseCreate();
  };

  onCreate = () => {
    this.field.validate((error: any, values: any) => {
      if (error) {
        return;
      }
      const { isEditRole } = this.props;
      const { name, alias, permPolicies } = values;
      const param = {
        name,
        alias,
        permPolicies,
      };
      this.setState({ loading: true });
      if (isEditRole) {
        updateRole(param)
          .then((res) => {
            this.setState({ loading: false });
            if (res) {
              Message.success(<Translation>Update role success</Translation>);
              this.props.onCreate();
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      } else {
        createRole(param)
          .then((res) => {
            this.setState({ loading: false });
            if (res) {
              Message.success(<Translation>Create role success</Translation>);
              this.props.onCreate();
            }
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  getTitle = () => {
    const { isEditRole } = this.props;
    if (isEditRole) {
      return <Translation>Edit Roles</Translation>;
    } else {
      return <Translation>New Roles</Translation>;
    }
  };

  render() {
    const init = this.field.init;
    const { Row, Col } = Grid;
    const FormItem = Form.Item;
    const { loading } = this.state;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const { isEditRole, permPolicies } = this.props;
    const buttons = [
      <Button type="secondary" onClick={this.onCloseCreate} style={{ marginRight: '16px' }}>
        <Translation>Cancel</Translation>
      </Button>,
      <Button type="primary" onClick={this.onCreate} loading={loading}>
        <If condition={isEditRole}>
          <Translation>Update</Translation>
        </If>
        <If condition={!isEditRole}>
          <Translation>Create</Translation>
        </If>
      </Button>,
    ];

    const permPoliciesList = getSelectLabel(permPolicies);
    return (
      <React.Fragment>
        <DrawerWithFooter
          title={this.getTitle()}
          placement="right"
          width={800}
          onClose={this.onCloseCreate}
          extButtons={buttons}
        >
          <Form {...formItemLayout} field={this.field}>
            <Row>
              <Col span={12} style={{ padding: '0 8px' }}>
                <FormItem
                  label={<Translation>Name</Translation>}
                  labelTextAlign="left"
                  required={true}
                >
                  <Input
                    name="name"
                    placeholder={i18n.t('Please enter').toString()}
                    maxLength={32}
                    disabled={isEditRole ? true : false}
                    {...init('name', {
                      rules: [
                        {
                          required: true,
                          pattern: checkName,
                          message: <Translation>Please enter a roles name</Translation>,
                        },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
              <Col span={12} style={{ padding: '0 8px' }}>
                <FormItem label={<Translation>Alias</Translation>}>
                  <Input
                    name="alias"
                    placeholder={i18n.t('Please enter').toString()}
                    {...init('alias', {
                      rules: [
                        {
                          minLength: 2,
                          maxLength: 64,
                          message: 'Enter a string of 2 to 64 characters.',
                        },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ padding: '0 8px' }}>
                <FormItem label={<Translation>PermPolicies</Translation>} required={true}>
                  <Select
                    {...init(`permPolicies`, {
                      rules: [
                        {
                          required: true,
                          message: 'Please select permPolicies',
                        },
                      ],
                    })}
                    locale={locale.Select}
                    mode="tag"
                    dataSource={permPoliciesList}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </DrawerWithFooter>
      </React.Fragment>
    );
  }
}

export default RolesDialog;
