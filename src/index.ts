import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import axios from 'axios';
import { stringify as qsStringify } from 'querystring';

class OccFileUpload extends Command {
  static description = 'describe the command here'
  static adminApiPath = '/ccadmin/v1';
  static loginEndpoint = '/mfalogin';
  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const occUrl = await cli.prompt('What is the OCC site URL?');
    const occFolder = await cli.prompt('What is path of the folder?');
    const occFile = await cli.prompt('What is the path of the file?');
    const occUser = await cli.prompt('What is your username/email?');
    const occPwd = await cli.prompt('What is your password?', { type: 'hide' });
    const occOtp = await cli.prompt('What is the OTP code?', { type: 'mask' });

    try {
      const token = await this.getAuthToken(occUrl, occUser, occPwd, occOtp);
      console.log('Token', token);
    } catch (error) {
      console.log('Error', error)
    }
  }

  async getAuthToken(url: string, username: string, password: string, totp: number):Promise<string | Error>{
    try {
      const reqBody = {
          username,
          password,
          totp,
        };
      const { data: { access_token } } = await axios({
        method: 'post',
        url: `${url}${OccFileUpload.adminApiPath}${OccFileUpload.loginEndpoint}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: `grant_type=password&username=${qsStringify(reqBody)}`,
      });

      return access_token;
    } catch (error) {
      return error;
    }
  }
}

export = OccFileUpload
